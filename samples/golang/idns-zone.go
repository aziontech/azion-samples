package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	sdk "github.com/aziontech/azionapi-go-sdk/idns"
)

const (
	intelligentDnsURL = "https://api.azionapi.net/"
)

type Client struct {
	apiClient sdk.APIClient
}

func main() {
	var personalToken string

	fmt.Println("Hey, there! Welcome to iDNS example")

	fmt.Println("Please, provide your Personal Token: ")
	fmt.Scanf("%s", &personalToken)

	err := IDNSHandler(personalToken)
	if err != nil {
		fmt.Println(err)
	}

}

// IDNSHandler
//
//   - I/O operations - asks and reads domain name e zone
//   - Instantiates a new client
//   - Calls NewIdns
func IDNSHandler(personalToken string) error {
	var domainName, dnsZone string
	active := true

	reader := bufio.NewReader(os.Stdin)

	fmt.Println("Plase, provide the Domain Name: ")
	domainName, err := reader.ReadString('\n')
	if err != nil {
		return err
	}
	domainName = strings.Replace(domainName, "\n", "", -1)

	fmt.Println("Enter a dns zone: ")
	dnsZone, err = reader.ReadString('\n')
	if err != nil {
		return err
	}
	dnsZone = strings.Replace(dnsZone, "\n", "", -1)

	var f *http.Client

	client := NewClient(f, intelligentDnsURL, personalToken)
	err = client.NewIdns(&domainName, &dnsZone, &active)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

// NewIdns
//   - Instantiate a sdk.Zone object
//   - Instantiate the request and exec it
//   - Prints success or error
func (c *Client) NewIdns(domainName, domain *string, active *bool) error {
	ctx := context.Background()
	idns := new(sdk.Zone)
	idns.Name = domainName
	idns.Domain = domain
	idns.IsActive = active

	fmt.Println("Creating iDNS zone....")

	req := c.apiClient.ZonesAPI.PostZone(ctx).Zone(*idns)
	_, httpResp, err := req.Execute()
	if err != nil {
		fmt.Println(httpResp)
		return err
	}
	bytes, err := io.ReadAll(httpResp.Body)
	if err != nil {
		return err
	}

	fmt.Println(string(bytes))
	return nil
}

// NewClient
//   - Instantiates a new skd-api client
//   - Set headers
func NewClient(f *http.Client, url string, token string) *Client {

	conf := sdk.NewConfiguration()

	conf.HTTPClient = f
	conf.AddDefaultHeader("Authorization", "token "+token)
	conf.AddDefaultHeader("Accept", "application/json;version=3")
	conf.Servers = sdk.ServerConfigurations{
		{URL: url},
	}

	return &Client{
		apiClient: *sdk.NewAPIClient(conf),
	}
}
